const protectedRoutes =
    [
        "/perfil",
        "/nova-denuncia",
        "/admin", 
        "/admin/denuncias", 
        "/admin/usuarios",
    ];

export function PreviusRouteVerify(path) {
    return protectedRoutes.some((protectedPath) => path.startsWith(protectedPath));
}
