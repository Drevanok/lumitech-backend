export declare class EmailService {
    private transporter;
    constructor();
    sendVerificationEmail(email: string, name: string, token: string): Promise<void>;
    sendRecoveryEmail(email: string, name: string, resetToken: string): Promise<void>;
}
