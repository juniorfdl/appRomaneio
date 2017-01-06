using FirebirdSql.Data.FirebirdClient;
using Models.Cadastros;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Models.FAT;
using Models.SIS;

namespace Infra.Base
{ 
    public class Context : DbContext
    {        
        public Context() : 
            base(new FbConnection(@"database=localhost:SUPORTECROISSANT;Port=3050;user=sysdba;password=masterkey"), true)
          //base("Name=BASE")
        {            
            Database.SetInitializer<Context>(null);
            Database.Initialize(false);
        }        

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            //Database.Log = d => System.Diagnostics.Debug.WriteLine(d);
            base.OnModelCreating(modelBuilder);
        }

        #region Entidades tipo sistema
        public virtual DbSet<SIS_USUARIO> SIS_USUARIO { get; set; }
        public virtual DbSet<SIS_USUARIO_EMPRESA> SIS_USUARIO_EMPRESA { get; set; }
       // public virtual DbSet<FiltrosBase> FiltrosBase { get; set; }        
        #endregion

        #region Entidades tipo Cadastros
        public virtual DbSet<CAD_SERVICO> CAD_SERVICO { get; set; }
        public virtual DbSet<CAD_COLABORADOR> CAD_COLABORADOR { get; set; }
        public virtual DbSet<CAD_COND_PAGAMENTO> CAD_COND_PAGAMENTO { get; set; }
        public virtual DbSet<CAD_PRODUTO> CAD_PRODUTO { get; set; }
        public virtual DbSet<CAD_VENDEDOR> CAD_VENDEDOR { get; set; }
        public virtual DbSet<CAD_EMPRESA> CAD_EMPRESA { get; set; }
        #endregion

        #region Entidades tipo FAT
        public virtual DbSet<FAT_ROMANEIO_PAO> FAT_ROMANEIO_PAO { get; set; }
        public virtual DbSet<VW_FAT_ROMANEIO_PAO> VW_FAT_ROMANEIO_PAO { get; set; }
        public virtual DbSet<FAT_ROMANEIO_PAO_ITEM> FAT_ROMANEIO_PAO_ITEM { get; set; }
        public virtual DbSet<FAT_OPERACAO_SAIDA> FAT_OPERACAO_SAIDA { get; set; }        
        #endregion


    }
}
