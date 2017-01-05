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

namespace Cad_Servico.Controllers
{
    public class cad_servicoController : CrudControllerBase<CAD_SERVICO>
    {
        protected override IOrderedQueryable<CAD_SERVICO> Ordenar(IQueryable<CAD_SERVICO> query)
        {
            return query.OrderBy(e => e.id);
        }
    }
}
