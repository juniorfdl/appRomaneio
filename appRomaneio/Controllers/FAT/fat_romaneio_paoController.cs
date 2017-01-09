namespace Controllers.FAT
{
    using Infra.Base.Interface.Base;
    using Models.FAT;
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
    using Newtonsoft.Json;
    using Infra.Base;

    public class fat_romaneio_paoController : CrudControllerBase<FAT_ROMANEIO_PAO>
    {
        private int GetOperacao(int COD_CADPRODUTO)
        {
            var query = db.CAD_PRODUTO_FATOPESAIDA.Where(q => q.id == COD_CADPRODUTO)
                .FirstOrDefault();

            if (query == null)
            { throw new InvalidOperationException("Produto não possui operação"); }

            return query.COD_FATOPERACAOSAIDA;
        }

        protected override IOrderedQueryable<FAT_ROMANEIO_PAO> Ordenar(IQueryable<FAT_ROMANEIO_PAO> query)
        {
            return query.OrderBy(e => e.id);
        }

        protected override void ExecutarAntesPost(FAT_ROMANEIO_PAO item)
        {
            item.CODIGO = db.Set<FAT_ROMANEIO_PAO>().Max(m => m.CODIGO) + 1;
        }

        protected override IQueryable<FAT_ROMANEIO_PAO> TrazerDadosParaLista(IQueryable<FAT_ROMANEIO_PAO> query)
        {
            var lista = query.ToList().AsQueryable();
            foreach (var item in lista)
            {
                var cli = db.CAD_COLABORADOR
                    .Where(b => b.id == item.COD_CADCOLABORADOR)
                    .FirstOrDefault();

                item.CLIENTE_NOME = cli.FANTASIA;
                item.CLIENTE_CODIGO = cli.CODIGO;
            }

            return lista;
        }

        protected override void BeforeReturn(FAT_ROMANEIO_PAO item)
        {
            var cli = db.CAD_COLABORADOR
                    .Where(b => b.id == item.COD_CADCOLABORADOR)
                    .FirstOrDefault();

            item.CLIENTE_NOME = cli.FANTASIA;
            item.CLIENTE_CODIGO = cli.CODIGO;

            if (item.COD_CADVENDEDOR != null)
            {
                var ven = db.CAD_VENDEDOR
                        .Where(b => b.id == item.COD_CADVENDEDOR)
                        .FirstOrDefault();

                item.VENDEDOR = ven.FANTASIA;
            }

            var itens = db.Set<FAT_ROMANEIO_PAO_ITEM>().Where(b => b.COD_FATROMANEIOPAO == item.id);
            var produtos = db.Set<CAD_PRODUTO>();

            var Query =
                from i in itens
                join p in produtos on i.COD_CADPRODUTO equals p.id
                orderby i.ITEM
                select new
                {
                    id = i.id,
                    COD_FATROMANEIOPAO = i.COD_FATROMANEIOPAO,
                    ITEM = i.ITEM,
                    COD_FATOPERACAOSAIDA = i.COD_FATOPERACAOSAIDA,
                    COD_CADPRODUTO = i.COD_CADPRODUTO,
                    COD_CADUNIDADE = i.COD_CADUNIDADE,
                    QUANTIDADE = i.QUANTIDADE,
                    VALOR_UNITARIO = i.VALOR_UNITARIO,
                    QUANTIDADE_TROCA = i.QUANTIDADE_TROCA,
                    PRODUTO = p.NOME
                };


            item.Itens = Query;
        }

        protected override void BeforeSaveChanges(FAT_ROMANEIO_PAO item)
        {
            var itens = db.Set<FAT_ROMANEIO_PAO_ITEM>()
               .Where(i => i.COD_FATROMANEIOPAO == item.id);

            foreach (FAT_ROMANEIO_PAO_ITEM i in itens)
            {
                db.Set<FAT_ROMANEIO_PAO_ITEM>().Remove(i);
            }

            if (item.Itens != null)
            {
                for (int i = 0; i < item.Itens.Count; i++)
                {
                    FAT_ROMANEIO_PAO_ITEM novo = new FAT_ROMANEIO_PAO_ITEM();

                    if (item.Itens[i].id == null)
                    {
                        var fb = new FuncoesBanco(new Context());
                        novo.id = fb.BuscarPKRegistro("FAT_ROMANEIO_PAO_ITEM");
                    }
                    else
                        novo.id = item.Itens[i].id;

                    novo.COD_FATROMANEIOPAO = item.id;
                    novo.COD_CADPRODUTO = item.Itens[i].COD_CADPRODUTO;
                    novo.COD_CADUNIDADE = item.Itens[i].COD_CADUNIDADE;

                    if (item.Itens[i].COD_FATOPERACAOSAIDA == null)
                        novo.COD_FATOPERACAOSAIDA = this.GetOperacao((int)item.Itens[i].COD_CADPRODUTO);
                    else
                        novo.COD_FATOPERACAOSAIDA = item.Itens[i].COD_FATOPERACAOSAIDA;

                    novo.ITEM = item.Itens[i].ITEM;
                    novo.PRODUTO = item.Itens[i].PRODUTO;
                    novo.QUANTIDADE = item.Itens[i].QUANTIDADE;
                    novo.QUANTIDADE_TROCA = item.Itens[i].QUANTIDADE_TROCA;
                    novo.VALOR_UNITARIO = item.Itens[i].VALOR_UNITARIO;
                    db.Set<FAT_ROMANEIO_PAO_ITEM>().Add(novo);
                }
            }

        }

        [Route("api/fat_romaneio_pao/ProdutosLook")]
        [HttpGet]
        public dynamic ProdutosLook([FromUri]CAD_PRODUTO filtros)
        {
            var cli = from m in db.Set<CAD_PRODUTO>()
                      join op in db.Set<CAD_PRODUTO_FATOPESAIDA>() on m.id equals op.id
                      orderby m.NOME
                      where m.NOME.StartsWith(filtros.NOME.ToUpper())
                      select m;
            return cli;
        }

    }
}
