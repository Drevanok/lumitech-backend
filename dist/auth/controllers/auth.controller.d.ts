import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { Response, Request } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto, res: Response): Promise<void>;
    refresh(req: Request, res: Response): Promise<void>;
}
