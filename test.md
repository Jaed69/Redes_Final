Aquí tienes todo consolidado: credenciales, IPs y los comandos de prueba para demostrar cada uno de los cuatro puntos.

## CREDENCIALES (guárdalas a la vista)

| Qué | Valor |
|-----|-------|
| Contraseña enable (switch y router) | `claseRedes` |
| Usuario SSH | `admin` |
| Contraseña usuario SSH | `Agro2026` |
| Dominio | `agrodroid.com` |
| Usuario FTP | `dron` |
| Contraseña FTP | `dron2026` |

## MAPA DE IPs (referencia rápida)

| Elemento | IP |
|----------|-----|
| Gateway VLAN 10 / SSH del switch | 192.168.50.1 |
| Servidor DHCP | 192.168.50.2 |
| Servidor DNS | 192.168.50.3 |
| Servidor Web | 192.168.50.4 |
| Servidor FTP | 192.168.50.5 |
| Base de Datos (PostgreSQL) | 192.168.50.6 |

---

## PUNTO 1 — Sede principal centralizada

Demuestra que la oficina concentra todo y rutea entre segmentos. En el switch core (entra con `enable` → `claseRedes`):

```
show ip route
show ip interface brief
```

`show ip route` debe mostrar todas las redes 192.168.50.x conectadas (las VLANs) más las rutas a viñedos. `show ip interface brief` muestra las SVI up/up. **Captura ambas.**

Prueba de centralización: desde un PC de un viñedo, ping a un servidor de la oficina:
```
ping 192.168.50.4
```

---

## PUNTO 2 — Segmentación por VLANs

En el switch core:

```
show vlan brief
show interfaces trunk
```

`show vlan brief` muestra las 9 VLANs con sus puertos. `show interfaces trunk` muestra los enlaces troncales a los switches de área con las VLANs activas. **Captura ambas.**

Prueba de aislamiento entre áreas: desde un PC de Comercial (VLAN 50), verifica que recibe IP de SU rango:
```
ipconfig
```
Debe mostrar una IP 192.168.50.50–.62 con máscara /28 y gateway .49. **Captura.**

---

## PUNTO 3 — Servicios en servidores (DNS, SSH, servicios del negocio)

**DNS funcionando** — desde un PC de cualquier área, navegador web (Desktop → Web Browser):
```
www.agrodroid.com
```
Debe cargar la página del servidor web. Esto prueba DNS + Web juntos. **Captura.**

**SSH funcionando** — desde un PC de la VLAN TI, Command Prompt:
```
ssh -l admin 192.168.50.1
```
Contraseña: `Agro2026`. Entrarás al switch (verás `SW_CORE_OFICINA>`). **Captura.**

Para verificar que SSH está activo, dentro del switch:
```
show ip ssh
```

**FTP funcionando (servicio del negocio: subida de imágenes de drones)** — desde un PC, Command Prompt:
```
ftp 192.168.50.5
```
Usuario: `dron`, contraseña: `dron2026`. Una vez dentro (`ftp>`), lista para confirmar acceso:
```
dir
```
**Captura** la conexión FTP exitosa. Este es el servicio clave que conecta con tu modelo de negocio (drones subiendo imágenes).

**DHCP funcionando** — ya lo cubre el `ipconfig` del punto 2, pero puedes reforzar con:
```
ipconfig /release
ipconfig /renew
```
Muestra cómo el PC pierde y vuelve a obtener IP del servidor. **Captura.**

---

## PUNTO 4 — ACL y seguridad

Primero, para que la prueba de ping sea válida evidencia, agrega el bloqueo ICMP a la ACL de la BD (en el switch, modo config):

```
configure terminal
ip access-list extended PROTEGER-DB
 no permit ip any any
 deny icmp any host 192.168.50.6
 permit ip any any
exit
end
write memory
```

**Ver las ACLs configuradas** — en el switch (modo enable, con el `#`):
```
show access-lists
```
Muestra las 3 ACLs con sus reglas y contadores. **Captura.**

**Prueba de ACL — área NO autorizada (Comercial) bloqueada a la BD:**
Desde un PC de Comercial, Command Prompt:
```
ping 192.168.50.6
```
Debe fallar (Request timed out / Destination host unreachable). **Captura.**

**Prueba de ACL — área autorizada (TI) SÍ llega a la BD:**
Desde un PC de TI:
```
ping 192.168.50.6
```
Debe responder. **Captura.** (El contraste entre las dos capturas es la mejor evidencia.)

**Prueba de ACL — Comercial SÍ carga la web (tráfico permitido):**
Desde el mismo PC de Comercial, navegador:
```
www.agrodroid.com
```
Debe cargar. **Captura.** Esto demuestra que la ACL bloquea la BD pero no la web.

**Ver port-security (esquema de seguridad):**
En el switch:
```
show port-security
show port-security interface gig1/0/9
```
Muestra los puertos protegidos, MAC máximas y modo violación. **Captura.**

---

## Checklist final de capturas (por punto)

**Punto 1:** `show ip route`, `show ip interface brief`, ping viñedo→servidor
**Punto 2:** `show vlan brief`, `show interfaces trunk`, `ipconfig` de un PC
**Punto 3:** web `www.agrodroid.com`, SSH desde TI, FTP con usuario dron, DHCP renew
**Punto 4:** `show access-lists`, ping bloqueado (Comercial), ping permitido (TI), web permitida, `show port-security`

Con esas capturas cubres los cuatro requisitos con evidencia visual completa.

Un detalle: si al hacer SSH desde el PC te da error, verifica con `show ip ssh` que esté habilitado y que generaste la llave RSA. Y para el FTP, confirma que en el servidor FTP (.5) el usuario `dron` tenga marcados los permisos de escritura/lectura, si no, no te dejará hacer `dir`.

¿Quieres que ahora te genere el documento Word con las tres secciones integradas y renumeradas (5.7.3/4/5 nuevas, capas a 5.7.6/7/8), con los marcadores de imagen y los comandos incluidos, listo para anexar?