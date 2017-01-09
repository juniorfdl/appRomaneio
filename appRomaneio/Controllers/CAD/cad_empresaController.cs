namespace Controllers.CAD
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

    public class cad_empresaController : CrudControllerBase<CAD_EMPRESA>
    {
        protected override IOrderedQueryable<CAD_EMPRESA> Ordenar(IQueryable<CAD_EMPRESA> query)
        {
            return query.OrderBy(e => e.id);
        }
       
    }    
    
}
