
namespace ConsoleApplicationEntity.Controllers.FAT
{
    using Infra.Base.Interface.Base;
    using Models.FAT;
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Data.Entity;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;
    using System.Web.Http.Description;
    
    public class fat_operacao_saidaController : CrudControllerBase<FAT_OPERACAO_SAIDA>
    {
        protected override IOrderedQueryable<FAT_OPERACAO_SAIDA> Ordenar(IQueryable<FAT_OPERACAO_SAIDA> query)
        {
            return query.OrderBy(e => e.id);
        }   
    }
}
