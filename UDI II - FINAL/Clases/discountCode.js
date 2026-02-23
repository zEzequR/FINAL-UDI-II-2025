export default class discountCode
{
    constructor(motivo, codigo, porcentaje)
    {
        this.motivo = motivo;
        this.codigo = codigo;
        this.porcentaje = porcentaje;
    }

    static async buscarCodigo(discCode)
    {
        try
        {
            const response = await fetch("../Constraints/discountCodes.json");
            const codesJSON = await response.json();
            return codesJSON.find(u => u.codigo === discCode.codigo.toUpperCase()) || null;
        }
        catch (error)
        {
            console.error("Error al buscar el código:", error);
            return null;
        }
    }
}