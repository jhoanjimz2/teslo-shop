import { Controller, Post, Body, Get, UseGuards, Req, Headers, SetMetadata }                      from '@nestjs/common';
import { AuthService }                                                                            from './auth.service';
import { CreateUserDto, LoginUserDto }                                                            from './dto';
import { AuthGuard }                                                                              from '@nestjs/passport';
import { RawHeaders, GetUser, RoleProtected, Auth }                                               from './decorators';
import { User }                                                                                   from './entities/user.entity';
import { UserRoleGuard }                                                                          from './guards';
import { ValidRoles }                                                                             from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: User
  ) {
    return this.authService.checkAuthStatus( user )
  }

  // Esta es la forma de ideal de implementar decoradores
  @Get('private3')
  @Auth( ValidRoles.admin )
  privateRoute3(
    @GetUser() user: User
  ) {
    return {
      ok: true,
      msg: "Hola mundo private",
      user
    }
  }




  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string[],
    @Headers() headers: any,
  ) {
    console.log(rawHeaders)
    return {
      ok: true,
      msg: "Hola mundo private",
      user,
      userEmail,
      rawHeaders,
      headers
    }
  }

  // @SetMetadata('roles', ['admin', 'super-admin'])
  @Get('private2')
  @RoleProtected( ValidRoles.superUser )
  @UseGuards( AuthGuard(), UserRoleGuard )
  privateRoute2(
    @GetUser() user: User
  ) {
    return {
      ok: true,
      msg: "Hola mundo private",
      user
    }
  }
}
