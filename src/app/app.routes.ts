import { Routes } from '@angular/router';
import { Home } from './pages/home/home';

//INICIO DE SESIÓN, REGISTRO, RECUPERAR CONTRASEÑA Y PERFIL
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Recover } from './pages/recover/recover';
import { Profile } from './pages/profile/profile';

//CATEGORÍAS Y PANEL DE ADMINISTRADOR
import { Categories } from './pages/categories/categories';
import { Panel } from './pages/panel/panel';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'login', component: Login },
    {path: 'registro', component: Register },
    {path: 'recuperar', component: Recover },
    {path: 'perfil', component: Profile },
    {path: 'categoria/:nombre', component: Categories},
    {path: 'panel', component: Panel},
    { path: '**', redirectTo: '' }
];

export class AppRoutingModule {}