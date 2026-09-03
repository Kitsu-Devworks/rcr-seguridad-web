<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // 1. Filtro anti-spam (si el campo invisible está lleno, se descarta)
    if (!empty($_POST['_gotcha'])) {
        header("Location: index.html#contacto");
        exit();
    }

    // 2. Sanitización de datos ingresados
    $nombre  = isset($_POST['nombre'])  ? filter_var(trim($_POST['nombre']), FILTER_SANITIZE_STRING) : '';
    $email   = isset($_POST['email'])   ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
    $mensaje = isset($_POST['mensaje']) ? filter_var(trim($_POST['mensaje']), FILTER_SANITIZE_STRING) : '';

    // Validar campos obligatorios
    if (empty($nombre) || empty($email) || empty($mensaje) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        header("Location: index.html?status=invalid#contacto");
        exit();
    }

    // 3. Configuración del correo de destino
    $destinatario = "rcr.seguridad@gmail.com";
    $asunto       = "Nuevo Requerimiento de Cotización - RCR Web";

    // 4. Estructura del cuerpo del mensaje
    $cuerpo  = "==========================================\n";
    $cuerpo .= "  NUEVO REQUERIMIENTO DE COTIZACIÓN - RCR \n";
    $cuerpo .= "==========================================\n\n";
    $cuerpo .= "Nombre / Razón Social: " . $nombre . "\n";
    $cuerpo .= "Correo de Contacto: " . $email . "\n\n";
    $cuerpo .= "Detalle del Requerimiento:\n";
    $cuerpo .= $mensaje . "\n\n";
    $cuerpo .= "------------------------------------------\n";
    $cuerpo .= "Enviado desde el formulario web de rcrseguridad.cl\n";

    // 5. Encabezados HTTP para evitar filtros de SPAM
    $headers  = "From: RCR Web <no-reply@rcrseguridad.cl>\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    // 6. Envío e instrucción de redirección
    if (mail($destinatario, $asunto, $cuerpo, $headers)) {
        header("Location: index.html?status=success#contacto");
    } else {
        header("Location: index.html?status=error#contacto");
    }
    exit();
} else {
    // Redirigir al inicio si se intenta acceder directamente al archivo .php
    header("Location: index.html");
    exit();
}
?>
