export declare const PASSWORD_MIN_LENGTH: number;
export declare const PASSWORD_MAX_LENGTH: number;
export interface PasswordRule {
  id: 'length' | 'upper' | 'lower' | 'number' | 'special';
  label: string;
  test: (password: string) => boolean;
}
export declare const PASSWORD_RULES: PasswordRule[];
export declare function checkPassword(password: string | null | undefined): { id: PasswordRule['id']; label: string; met: boolean }[];
export declare function isStrongPassword(password: string | null | undefined): boolean;
export declare const PASSWORD_RULES_MESSAGE: string;
