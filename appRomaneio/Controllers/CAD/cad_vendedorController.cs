namespace cad_vendedor.Controllers
{
    using Infra.Base.Interface.Base;
    using Models.Cadastros;
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Data.Entity;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;
    using System.Web.Http.Description;

    public class cad_vendedorController : CrudControllerBase<CAD_VENDEDOR>
    {
        protected override IOrderedQueryable<CAD_VENDEDOR> Ordenar(IQueryable<CAD_VENDEDOR> query)
        {
            return query.OrderBy(e => e.id);
        }
       
    }    
    
}
