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

    public class cad_produtoController : CrudControllerBase<CAD_PRODUTO>
    {
        protected override IOrderedQueryable<CAD_PRODUTO> Ordenar(IQueryable<CAD_PRODUTO> query)
        {
            return query.OrderBy(e => e.id);
        }

        [Route("api/cad_produto/ProdutosLook/{Nome}")]
        [HttpGet]
        public dynamic ProdutosLook(string Nome)
        {
            var cli = from m in db.Set<CAD_PRODUTO>()
                      orderby m.NOME
                      where m.NOME.StartsWith(Nome.ToUpper())
                      select m;
            return cli;
        }

    }    
    
}
