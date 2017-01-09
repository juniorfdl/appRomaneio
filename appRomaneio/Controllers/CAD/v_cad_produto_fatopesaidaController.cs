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

    public class v_cad_produto_fatopesaidaController : CrudControllerBase<V_CAD_PRODUTO_FATOPESAIDA>
    {
        protected override IOrderedQueryable<V_CAD_PRODUTO_FATOPESAIDA> Ordenar(IQueryable<V_CAD_PRODUTO_FATOPESAIDA> query)
        {
            return query.OrderBy(e => e.id);
        }       
    }    
    
}
