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

    public class cad_colaboradorController : CrudControllerBase<CAD_COLABORADOR>
    {
        protected override IOrderedQueryable<CAD_COLABORADOR> Ordenar(IQueryable<CAD_COLABORADOR> query)
        {
            return query.OrderBy(e => e.id);
        }

        [Route("api/cad_colaborador/ClientesLook/{Fantasia}")]
        [HttpGet]
        public dynamic ClientesLook(string Fantasia)
        {
            var cli = from m in db.Set<CAD_COLABORADOR>()
                      orderby m.FANTASIA
                      where m.FANTASIA.StartsWith(Fantasia.ToUpper()) & m.TCLI.StartsWith("C")
                      select m;
            return cli;
        }

    }    
    
}
