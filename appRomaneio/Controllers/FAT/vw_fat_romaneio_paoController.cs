

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
    
    public class vw_fat_romaneio_paoController : CrudControllerBase<VW_FAT_ROMANEIO_PAO>
    {
        protected override IOrderedQueryable<VW_FAT_ROMANEIO_PAO> Ordenar(IQueryable<VW_FAT_ROMANEIO_PAO> query)
        {
            return query.OrderBy(e => e.id);
        }   
    }
}
