import codigos from "../Clases/discountCode.js"

const apiUrl = 'https://fakestoreapi.com/products';
let cart = 
{
    userId: null,
    products: []
};
let totalCarrito = 0;
let products;
let descuentoActivo = 0;

const ParseARS = new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
});

function escapeHtml(str = "")
{
    return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function mostrarCerrarCarrito(accion)
{
    const barraLat = document.querySelector(".carritoPago");
    
    switch (accion) {
        case "abrir":
            barraLat.removeAttribute('hidden');
            barraLat.style.animationDirection = "normal";
            
            barraLat.classList.remove("animacion-carrito");
            void barraLat.offsetWidth;
            barraLat.classList.add("animacion-carrito");
            break;
            
        case "cerrar":
            barraLat.style.animationDirection = "reverse";
            
            barraLat.classList.remove("animacion-carrito");
            void barraLat.offsetWidth; 
            barraLat.classList.add("animacion-carrito");

            barraLat.addEventListener("animationend", () => {
                if (barraLat.style.animationDirection === "reverse")
                    {
                        barraLat.setAttribute('hidden', '');
                    }
            }, { once: true });
            break;
    }
}

function cartcounter(modo)
{
    const cantCartElement = document.getElementById("cantCart");
    
    if (cantCartElement) {
        let cantidadActual = parseInt(cantCartElement.innerText) || 0;

        if (modo === "sumar") {
            cantidadActual++;
        } else if (modo === "restar" && cantidadActual > 0) {
            cantidadActual--;
        }
        cantCartElement.innerText = cantidadActual;
    }
}

function getAndWriteUsername()
{
    const userJSON = sessionStorage.getItem('usuActual');
    if (!userJSON)
        {
            return;
        }

    const user = JSON.parse(userJSON);
    const userTxt = document.getElementById('userTxt');
    if (!userTxt)
        {
            return;
        }
    userTxt.innerHTML = `<img src="../IMG/nopic.jpg" alt="user"> ${escapeHtml(user.username)}`;
}

function getUserID()
{
    const userJSON = sessionStorage.getItem('usuActual');
    if (!userJSON)
        {
            return;
        }

    const user = JSON.parse(userJSON);
    if (!user)
        {
            return;
        }
    else
        {
            return user.id
        }
}

function calculodescuento(total, porcentaje, accion)
{
    let descuento = (porcentaje / 100) * totalCarrito;
    switch (accion)
    {
        case "agregar":
            totalCarrito -= descuento;
            return totalCarrito;
        case "eliminar":
            totalCarrito += descuento;
            return totalCarrito;
        default:
            break;
    }
}

async function obtenercodigos(codigo)
{
    const divCodigo = document.querySelector(".acceptCodeMsg");
    const errorMsg = document.getElementById("errorCodeMsg");
    const cerrarCodigo = document.querySelector(".codDesc #cerrarCart");

    try {
        let resp = await codigos.buscarCodigo(codigo);
        if (resp != null) {
            document.getElementById("descCode").innerText = resp.codigo.toUpperCase();
            
            let porcentaje = Number(resp.porcentaje);
            descuentoActivo = porcentaje;
            calculodescuento(totalCarrito, descuentoActivo, "agregar");

            const monto = document.getElementById('monto');
            if (monto) {
                monto.innerHTML = `
                    <svg id="moneyIcon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-currency-dollar" viewBox="0 0 16 16">
                    <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73z"/>
                    </svg>
                    ${ParseARS.format(totalCarrito)}
                `;
            }

            if (errorMsg)
                {
                    errorMsg.setAttribute('hidden', '');
                }

            if (divCodigo)
                {
                    divCodigo.removeAttribute('hidden');
                    divCodigo.style.animationDirection = "normal";
                    divCodigo.classList.remove("codeAppear");
                    void divCodigo.offsetWidth;
                    divCodigo.classList.add("codeAppear");
                    document.getElementById("disCodeInp").disabled = true;

                    cerrarCodigo.addEventListener("click", () => {
                        descuentoActivo = 0;
                        divCodigo.style.animationDirection = "reverse";
                        divCodigo.classList.remove("codeAppear");
                        void divCodigo.offsetWidth;
                        divCodigo.setAttribute('hidden', '');
                        document.getElementById("disCodeInp").value = "";
                        document.getElementById("disCodeInp").disabled = false;
                        document.getElementById("disCodeInp").focus();
                        calculodescuento(totalCarrito, descuentoActivo, "eliminar");
                        renderizarCarrito();

                        const monto = document.getElementById('monto');
                        if (monto)
                            {
                                monto.innerHTML = `
                                    <svg id="moneyIcon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-currency-dollar" viewBox="0 0 16 16">
                                    <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73z"/>
                                    </svg>
                                    ${ParseARS.format(totalCarrito)}
                                `;
                            }
                    });
                }
        }
        else
            {
                if (divCodigo) 
                    {
                        divCodigo.setAttribute('hidden', '');
                    }
                if (errorMsg)
                {
                    errorMsg.removeAttribute('hidden');
                    errorMsg.style.animationDirection = "normal";
                    errorMsg.classList.remove("codeAppear");
                    void errorMsg.offsetWidth;
                    errorMsg.classList.add("codeAppear");
                    document.getElementById("disCodeInp").value = "";
                    document.getElementById("disCodeInp").focus();
                }
            }
    } catch (err) {
        console.error('Error al verificar código:', err);
        if (errorMsg)
            {
                errorMsg.removeAttribute('hidden');
            }
    }
}

function renderizarCarrito() {
    const listaCarrito = document.querySelector(".listaProd");
    listaCarrito.innerHTML = "";
    totalCarrito = 0;

    cart.products.forEach((prod, index) => {
        const precioNumerico = parseFloat(prod.price);
        totalCarrito += precioNumerico;

        const li = document.createElement("li");
        li.innerHTML = `
            <img id="productImagen" src="${prod.image}" alt="${prod.title}">
            <div class="prodDetails">
                <svg id="borrarProd" class="borrarProd" data-index="${index}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16" style="cursor:pointer">
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                </svg>
                <label id="productoNombre">${prod.title}</label>
                <label id="precioUni">$${ParseARS.format(precioNumerico)}</label>
            </div>
        `;
        listaCarrito.appendChild(li);
    });

    if (descuentoActivo > 0)
        {
            calculodescuento(totalCarrito, descuentoActivo, "agregar");
        }

    const monto = document.getElementById('monto');
    monto.innerHTML =
    `
        <svg id="moneyIcon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-currency-dollar" viewBox="0 0 16 16">
        <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73z"/>
        </svg>
        ${ParseARS.format(totalCarrito)}
    `;
}

function renderProducts(products)
{
    const ul = document.getElementById("productsList");
    ul.innerHTML = "";
        products.forEach((p) => {
            const title = escapeHtml(p.title);
            const image = p.image;
            const rawPrice = (Number(p.price) * 1455);

            const price = ParseARS.format(rawPrice);

            const li = document.createElement("li");
            li.className = "product";

            li.innerHTML = 
                `
                <img id="productImage" src="${escapeHtml(image)}" alt="${title}">
                <label id="productName">${title}</label>
                <div class="precioCarrito">
                    <label id="value">
                        <svg id="moneyIcon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-currency-dollar" viewBox="0 0 16 16">
                        <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73z"/>
                        </svg>
                        ${price} ARS
                    </label>
                    <svg id="cartIcon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart-plus" viewBox="0 0 16 16">
                    <path d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9z"/>
                    <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zm3.915 10L3.102 4h10.796l-1.313 7zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                    </svg>
                </div>
                `
            li.dataset.product = JSON.stringify({
                id: p.id,
                title: title,
                price: price,
                image: image
            });

            const btnAgregar = li.querySelector("#cartIcon"); 
            btnAgregar.addEventListener("click", (e) =>
                {
                e.stopPropagation();
                cartcounter("sumar");
                let uID = getUserID();
                const productData =
                    {
                        id: p.id,
                        title: p.title,
                        price: (Number(p.price) * 1455).toFixed(0),
                        image: p.image
                    };
                Cart(uID, productData);
            });

        ul.appendChild(li);

        });
}

async function Cart(userID, productData)
{
    cart.userId = userID;

    cart.products.push({
        id: productData.id,
        title: productData.title,
        price: productData.price,
        image: productData.image
    });

    try
    {
        await fetch('https://fakestoreapi.com/carts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cart)
        });

        renderizarCarrito();
    }
    catch (err)
    {
        console.error("Error al añadir el producto:", err);
    }
}

async function loadProducts()
{
    const ul = document.getElementById("productsList");

    try
    {
        const res = await fetch(apiUrl);

        products = await res.json();

        console.log(products);
        renderProducts(products);
    }
    catch (err)
    {
        alert("Error al cargar productos:", err);
    }
}

function procesarPago()
{
    const advExito = document.querySelector(".compraAceptada");
    const texto = document.getElementById("compraAceptadaTxt");
    const monto = document.getElementById("monto");

    if (!advExito)
        {
            return;
        }

    if (!advExito.hasAttribute('hidden'))
        {
        advExito.classList.remove('animateCompra');
        void advExito.offsetWidth;
    }
    else
        {
            advExito.removeAttribute('hidden');
        }

    advExito.style.setProperty('--compra-duration', `${3500 / 1000}s`);

    advExito.classList.add('animateCompra');

    const onAnimEnd = (e) =>
        {
            if (e.animationName !== 'slideDownUp')
                {
                    return;
                }
            advExito.setAttribute('hidden', '');
            advExito.classList.remove('animateCompra');
            advExito.removeEventListener('animationend', onAnimEnd);
            advExito.style.removeProperty('--compra-duration');
        };

    advExito.addEventListener('animationend', onAnimEnd);


    const finalPrecio = monto ? monto.textContent.trim() : '';
    if (texto)
        {
            texto.textContent = `Se realizó tu compra por: $${finalPrecio}`;
        }

    cart.products.splice(0, cart.products.length);
    renderizarCarrito();
    document.getElementById("cantCart").innerText = 0;
}


document.getElementById("cerrarCart").addEventListener("click", () => {
    mostrarCerrarCarrito("cerrar");
});

document.querySelector(".carrito").addEventListener("click", () => {
    mostrarCerrarCarrito("abrir");
});

document.getElementById("applyBtn").addEventListener("click", () =>
    {
        let codigoInp = document.getElementById("disCodeInp").value;
        
        let codigo = new codigos
        (
            null,
            codigoInp,
            null
        )
        obtenercodigos(codigo);
    });



document.addEventListener("click", (e) => {
    const botonBorrar = e.target.closest(".borrarProd");
    
    if (botonBorrar)
        {
            const index = parseInt(botonBorrar.getAttribute("data-index"));
            cart.products.splice(index, 1);
            cartcounter("restar");
            descuentoActivo = 0;
            renderizarCarrito();
        }
});

document.getElementById("pagarBtn").addEventListener("click", procesarPago);

document.addEventListener("DOMContentLoaded", loadProducts);
document.addEventListener("DOMContentLoaded", getAndWriteUsername);