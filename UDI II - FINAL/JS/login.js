import Users from "../Clases/user.js"


const form = document.querySelector("form");
const loginBtn = document.getElementById("loginBtn");
const adv = document.getElementById("advertencia");


async function iniciarSesion(event)
{
    event.preventDefault();

    let email = document.getElementById("emailInp").value;
    let psw = document.getElementById("passwrdInp").value;

    let usuario = new Users(0,
        "null",
        email,
        psw
    );

    let resp = await Users.buscarUsuario(usuario)
    if (resp != null)
        {
            let navigated = false;
            document.body.classList.add("fade-out");
            const onEnd = () => {
                if (navigated)
                    {
                        return;
                    }
                    const usuarioActual = { id: resp.id, username: resp.username, email: resp.email };
                    sessionStorage.setItem('usuActual', JSON.stringify(usuarioActual));
                navigated = true;
                window.location.href = "../HTML/main.html";
            };

            document.body.addEventListener("animationend", onEnd, { once: true });
        }
    else
        {
            document.getElementById("emailInp").value = "";
            document.getElementById("passwrdInp").value = "";
            
            adv.removeAttribute('hidden');
            adv.classList.remove("desvanecer");
            void adv.offsetWidth;
            adv.classList.add("desvanecer");

            document.getElementById("emailInp").focus();
        }
}

form.addEventListener("submit", iniciarSesion);
