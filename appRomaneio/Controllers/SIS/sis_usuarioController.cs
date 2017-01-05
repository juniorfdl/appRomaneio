namespace ConsoleApplicationEntity.Controllers.Sistema
{
    using Infra.Base.Interface.Base;
    using Models.Cadastros;
    using Models.SIS;
    using Sistema;
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Data.Entity;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;
    using System.Web.Http.Description;

    public class sis_usuarioController : CrudControllerBase<SIS_USUARIO>
    {
        protected override IOrderedQueryable<SIS_USUARIO> Ordenar(IQueryable<SIS_USUARIO> query)
        {
            return query.OrderBy(e => e.id);
        }

        protected override void BeforeReturn(SIS_USUARIO item)
        {
            if (item.COD_CADVENDEDOR != null)
            {
                var ven = db.CAD_VENDEDOR
                        .Where(b => b.id == item.COD_CADVENDEDOR)
                        .FirstOrDefault();

                item.VENDEDOR = ven.FANTASIA;
            }
        }

        [Route("api/sis_usuario/localizar")]
        [HttpGet]
        public IHttpActionResult Localizar([FromUri]SIS_USUARIO usuario)
        {
            SIS_USUARIO item = this.TrazerDadosParaEdicao(db.Set<SIS_USUARIO>())
                  .FirstOrDefault(e => e.NOME == usuario.NOME & e.PWD == usuario.PWD);      

            if (item == null)
            {
                return NotFound();
            }

            if (item.COD_CADVENDEDOR != null)
            {
                var ven = db.CAD_VENDEDOR
                        .Where(b => b.id == item.COD_CADVENDEDOR)
                        .FirstOrDefault();

                item.VENDEDOR = ven.FANTASIA;
            }

            return Ok(item);            
        }


        [Route("api/sis_usuario/Empresa")]
        [HttpGet]
        public dynamic Empresa([FromUri]SIS_USUARIO usuario)
        {                        
            var usr = db.Set<SIS_USUARIO_EMPRESA>()                       
                .Where(b => b.CODIGOSISUSUARIO == usuario.id);

            var emp = db.Set<CAD_EMPRESA>();

            var Query =
                from u in usr
                join e in emp on u.CODIGOEMPRESA equals e.id
                orderby e.FANTASIA
                select new
                {
                    CODIGOEMPRESA = u.CODIGOEMPRESA,
                    CEMP = e.CEMP,
                    FANTASIA = e.FANTASIA,
                    NOME = e.NOME
                };

            return Query;
        }

    }
}
