namespace cad_colaborador.Controllers
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

    public class cad_cond_pagamentoController : CrudControllerBase<CAD_COND_PAGAMENTO>
    {
        protected override IOrderedQueryable<CAD_COND_PAGAMENTO> Ordenar(IQueryable<CAD_COND_PAGAMENTO> query)
        {
            return query.OrderBy(e => e.id);
        }        

    }    
    
}
