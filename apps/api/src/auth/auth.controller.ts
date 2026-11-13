import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthService, readSessionToken, serializeSessionCookie } from "./auth.service.js";
import { assertJsonRequest, type HttpRequest, type HttpResponse } from "./auth.http.js";
import { CsrfGuard, SessionGuard } from "./auth.guards.js";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(200)
  @Header("Cache-Control", "no-store")
  async login(
    @Body() input: unknown,
    @Req() request: HttpRequest,
    @Res({ passthrough: true }) response: HttpResponse,
  ) {
    assertJsonRequest(request);
    const login = await this.authService.login(input, readSessionToken(request));
    response.setHeader("Set-Cookie", serializeSessionCookie(login.rawToken));
    return login.response;
  }

  @Get("me")
  @Header("Cache-Control", "no-store")
  @UseGuards(SessionGuard)
  async me(@Req() request: HttpRequest) {
    const session = await this.authService.authenticateRequest(request);
    return this.authService.toResponse(session);
  }

  // 첫 화면과 로그인 화면이 로그인 여부만 확인할 때 쓴다. 세션 쿠키가 아예 없으면 401 대신
  // { session: null }을 돌려 익명 방문마다 브라우저 콘솔에 요청 실패가 남지 않게 한다.
  @Get("session")
  @Header("Cache-Control", "no-store")
  async currentSession(@Req() request: HttpRequest) {
    if (readSessionToken(request) === undefined) {
      return { session: null };
    }
    const session = await this.authService.authenticateRequest(request);
    return { session: this.authService.toResponse(session) };
  }

  @Post("logout")
  @HttpCode(200)
  @Header("Cache-Control", "no-store")
  @UseGuards(SessionGuard, CsrfGuard)
  async logout(
    @Req() request: HttpRequest,
    @Res({ passthrough: true }) response: HttpResponse,
  ) {
    const session = await this.authService.authenticateRequest(request);
    await this.authService.logout(session.sessionId);
    response.setHeader("Set-Cookie", serializeSessionCookie("", true));
    return { ok: true };
  }
}
