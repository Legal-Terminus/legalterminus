#!/usr/bin/env bash
# E24-S00 — deploy the QA environment by hand. No CI, on purpose: QA is temporary.
#
#   scripts/deploy-qa.sh            # everything
#   scripts/deploy-qa.sh api        # one part: api | portal | site | rules
#
# QA lives in the PRODUCTION project (legal-terminus-web) with its own Cloud Run
# services, Firestore database ("qa"), bucket and Hosting site. It shares the
# project's sign-in accounts, so the API runs with TEST_ACCOUNT_EMAIL_DOMAINS
# set — see backend/src/config/testEnvironment.js before changing that.
#
# Nothing here touches the live services or the live site.
set -euo pipefail
cd "$(dirname "$0")/.."

PROJECT=legal-terminus-web
REGION=asia-south2
REPO=$REGION-docker.pkg.dev/$PROJECT/legal-terminus-qa
SITE_URL=https://legal-terminus-qa.web.app
DATABASE_ID=qa-data
BUCKET=legal-terminus-web-qa
TEST_DOMAINS=legalterminus.test
PART=${1:-all}
TAG=$(git rev-parse --short HEAD)-$(date +%H%M)

want() { [ "$PART" = all ] || [ "$PART" = "$1" ]; }
web() { grep -E "^$1=" Portal/.env.local | head -1 | cut -d= -f2- | tr -d '"'; }

if want api || want portal; then
  echo "▶ building images ($TAG)"
  gcloud builds submit . --project $PROJECT --region $REGION --config cloudbuild.qa.yaml \
    --substitutions=_REPO=$REPO,_TAG=$TAG,_SITE_URL=$SITE_URL,_DATABASE_ID=$DATABASE_ID,_VITE_FIREBASE_API_KEY=$(web VITE_FIREBASE_API_KEY),_VITE_FIREBASE_AUTH_DOMAIN=$(web VITE_FIREBASE_AUTH_DOMAIN),_VITE_FIREBASE_PROJECT_ID=$(web VITE_FIREBASE_PROJECT_ID),_VITE_FIREBASE_STORAGE_BUCKET=$BUCKET,_VITE_FIREBASE_MESSAGING_SENDER_ID=$(web VITE_FIREBASE_MESSAGING_SENDER_ID),_VITE_FIREBASE_APP_ID=$(web VITE_FIREBASE_APP_ID) \
    >/dev/null
fi

if want api; then
  echo "▶ deploying legal-terminus-api-qa"
  ENVFILE=$(mktemp)
  trap 'rm -f "$ENVFILE"' EXIT
  # The service-account values come from backend/.env and are written to a
  # temp file that is deleted on exit — they are never printed.
  python3 - "$ENVFILE" "$TAG" "$DATABASE_ID" "$BUCKET" "$TEST_DOMAINS" "$SITE_URL" <<'PY'
import json, re, sys
out, tag, database, bucket, domains, site = sys.argv[1:]
env = {}
for line in open('backend/.env'):
    m = re.match(r'^([A-Z_0-9]+)=(.*)$', line.rstrip('\n'))
    if m:
        v = m.group(2).strip()
        if len(v) >= 2 and v[0] == v[-1] and v[0] in '"\'': v = v[1:-1]
        env[m.group(1)] = v
keep = ['FIREBASE_PROJECT_ID', 'FIREBASE_PRIVATE_KEY_ID', 'FIREBASE_PRIVATE_KEY',
        'FIREBASE_CLIENT_EMAIL', 'FIREBASE_CLIENT_ID', 'FIREBASE_CLIENT_CERT_URL']
# Optional extras a feature under test may need (e.g. gateway TEST keys).
keep += [k for k in env if k.startswith('RAZORPAY_')]
missing = [k for k in keep[:6] if not env.get(k)]
if missing: sys.exit(f'backend/.env is missing: {missing}')
vals = {k: env[k] for k in keep}
vals.update({
    'NODE_ENV': 'production', 'DEPLOYMENT_MODE': 'qa',
    'APP_VERSION': json.load(open('package.json'))['version'] + '-qa', 'GIT_SHA': tag,
    'FIRESTORE_DATABASE_ID': database, 'FIREBASE_STORAGE_BUCKET': bucket,
    'TEST_ACCOUNT_EMAIL_DOMAINS': domains,
    # QA never emails anyone. (This also lifts the API rate limit, as in e2e.)
    'EMAIL_DISABLED': 'true',
    # A stand-in for the payment gateway. Only works in a test environment.
    'PAYMENT_GATEWAY': 'simulated',
    'FRONTEND_URL': site, 'BASE_URL': site,
})
with open(out, 'w') as f:
    for k, v in vals.items(): f.write(f'{k}: {json.dumps(v)}\n')
PY
  gcloud run deploy legal-terminus-api-qa --project $PROJECT --region $REGION \
    --image=$REPO/backend-qa:$TAG --env-vars-file="$ENVFILE" \
    --platform=managed --allow-unauthenticated --port=8080 \
    --min-instances=0 --max-instances=2 --memory=512Mi --cpu=1 2>&1 | grep -E "deployed|failed" || true
fi

if want portal; then
  echo "▶ deploying legal-terminus-portal-qa"
  gcloud run deploy legal-terminus-portal-qa --project $PROJECT --region $REGION \
    --image=$REPO/portal-qa:$TAG \
    --platform=managed --allow-unauthenticated --port=8080 \
    --min-instances=0 --max-instances=2 --memory=512Mi --cpu=1 2>&1 | grep -E "deployed|failed" || true
fi

if want site; then
  echo "▶ building and deploying the website to $SITE_URL"
  (cd Frontend && VITE_API_BASE_URL=$SITE_URL VITE_FIRESTORE_DATABASE_ID=$DATABASE_ID VITE_PAYMENTS_ENABLED=true \
     VITE_FIREBASE_STORAGE_BUCKET=$BUCKET npm run build >/dev/null)
  # firebase.qa.json names the QA site explicitly, so this cannot release to the live one.
  firebase deploy --only hosting --config firebase.qa.json --project $PROJECT | grep -E "✔|Error"
fi

if want rules; then
  echo "▶ deploying Firestore rules and indexes to the \"$DATABASE_ID\" database"
  firebase deploy --only firestore --config firebase.qa.json --project $PROJECT | grep -E "✔|Error"
fi

echo "▶ checks"
for path in "" "portal/" "api/public/pricing"; do
  printf "  %s  %s/%s\n" "$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "$SITE_URL/$path")" "$SITE_URL" "$path"
done
