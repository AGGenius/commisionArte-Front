import './TermsPage.css'

const TermsPage = () => {
    return (
        <div className="termsPage">
            <header className="termsPage--header">
                <h1 className="termsPage--title">Términos de Servicio</h1>
            </header>
            <section className="termsPage__section">
                <h2 className="termsPage__section--title">1. Objeto del servicio</h2>
                <p className="termsPage__section--content">
                    Esta plataforma web ha sido desarrollada exclusivamente como proyecto final de un curso formativo,
                    sin fines comerciales ni uso profesional real. Su objetivo es facilitar la conexión entre artistas
                    y clientes mediante la publicación y aceptación de solicitudes de trabajo artístico.
                </p>
            </section>
            <section className="termsPage__section">
                <h2 className="termsPage__section--title">2. Registro y tipos de usuario</h2>
                <p className="termsPage__section--content">
                    Para utilizar la plataforma es necesario registrarse como artista o cliente. Cada usuario es responsable
                    de la veracidad de los datos proporcionados durante el registro y de su posterior actualización.
                </p>
                <p className="termsPage__section--content">
                    El registro en la plataforma implica la aceptación expresa de estos Términos de Servicio.
                </p>
            </section>
            <section className="termsPage__section">
                <h2 className="termsPage__section--title">3. Uso de contenidos</h2>
                <ul className="termsPage__section--list">
                    <li className="termsPage__section--list--item">Los artistas pueden subir imágenes a su portfolio manteniendo en todo momento la autoría y los derechos sobre sus obras.</li>
                    <li className="termsPage__section--list--item">Está prohibido subir contenido ilegal, violento, político, relacionado con personas reales o cualquier otro contenido inapropiado.</li>
                    <li className="termsPage__section--list--item">Para la presentación del proyecto no se utilizará ningún tipo de contenido explícito.</li>
                </ul>
                <p className="termsPage__section--content">
                    El incumplimiento de estas normas podrá suponer la suspensión o eliminación de la cuenta.
                </p>
            </section>
            <section className="termsPage__section">
                <h2 className="termsPage__section--title">4. Censura y visibilidad de imágenes</h2>
                <p className="termsPage__section--content">
                    Las imágenes que requieran censura visual serán almacenadas junto a una versión difuminada.
                </p>
                <ul className="termsPage__section--list">
                    <li className="termsPage__section--list--item">Los usuarios no registrados o con filtros activos solo podrán visualizar la versión censurada.</li>
                    <li className="termsPage__section--list--item">Los usuarios registrados podrán acceder a la versión sin censura únicamente si interactúan con el contenido y activan la opción correspondiente.</li>
                </ul>
            </section>
            <section className="termsPage__section">
                <h2 className="termsPage__section--title">5. Solicitudes y trabajos</h2>
                <p className="termsPage__section--content">
                    Los clientes pueden crear solicitudes de trabajo que incluyen título, descripción, estado y fecha de creación.
                    Cuando un artista acepta una solicitud, se genera una tarjeta de trabajo asociada a ambas partes.
                </p>
                <p className="termsPage__section--content">
                    El artista podrá actualizar el estado y los comentarios del trabajo para reflejar su progreso.
                    Una vez finalizado y aceptado por el cliente, ambas partes podrán valorarse mutuamente.
                </p>
            </section>
            <section className="termsPage__section">
                <h2 className="termsPage__section--title">6. Comunicación entre usuarios</h2>
                <p className="termsPage__section--content">
                    La plataforma no dispone de sistemas de mensajería interna. La comunicación entre artistas y clientes
                    deberá realizarse mediante los datos de contacto facilitados por los propios usuarios.
                </p>
                <p className="termsPage__section--content">
                    El correo electrónico es un dato de contacto obligatorio.
                </p>
            </section>
            <section className="termsPage__section">
                <h2 className="termsPage__section--title">7. Reputación y bloqueos</h2>
                <p className="termsPage__section--content">
                    El sistema de reputación tiene un carácter orientativo y académico. Los usuarios podrán bloquear
                    a otros usuarios para evitar futuras interacciones entre ambas partes.
                </p>
            </section>
            <section className="termsPage__section">
                <h2 className="termsPage__section--title">8. Administración del servicio</h2>
                <p className="termsPage__section--content">
                    El administrador del proyecto podrá revisar y eliminar contenidos que incumplan estos términos,
                    activar manualmente las cuentas de usuario y suspender o eliminar cuentas en caso de uso indebido
                    de la plataforma.
                </p>
            </section>
            <section className="termsPage__section">
                <h2 className="termsPage__section--title">9. Modificación y eliminación de cuentas</h2>
                <p className="termsPage__section--content">
                    Los usuarios podrán modificar sus datos personales desde su perfil y solicitar la eliminación
                    de su cuenta siguiendo el proceso habilitado en la plataforma.
                </p>
            </section>
            <section className="termsPage__section">
                <h2 className="termsPage__section--title">10. Carácter no vinculante</h2>
                <p className="termsPage__section--content">
                    Esta plataforma es un proyecto académico sin uso real. Los presentes Términos de Servicio
                    no tienen validez legal y se presentan únicamente con fines educativos y demostrativos.
                </p>
            </section>
        </div>
    );
}

export default TermsPage;