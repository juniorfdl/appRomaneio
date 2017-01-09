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

    public class cad_produto_fatopesaidaController : CrudControllerBase<CAD_PRODUTO_FATOPESAIDA>
    {
        protected override IOrderedQueryable<CAD_PRODUTO_FATOPESAIDA> Ordenar(IQueryable<CAD_PRODUTO_FATOPESAIDA> query)
        {
            return query.OrderBy(e => e.id);
        }

        protected override void ExecutarAntesPost(CAD_PRODUTO_FATOPESAIDA item)
        {
            if (item.id == 0)
            {
                item.id = item.COD_PRODUTO;               
            }
        }

        protected override void BeforeReturn(CAD_PRODUTO_FATOPESAIDA item)
        {
            var cli = db.CAD_PRODUTO
                    .Where(b => b.id == item.id)
                    .FirstOrDefault();
            item.PRODUTO_NOME = cli.NOME;
            item.COD_PRODUTO = item.id;
        }

    }    
    
}
