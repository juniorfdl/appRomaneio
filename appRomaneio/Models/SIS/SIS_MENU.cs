namespace Models.SIS
{
    using Infra.Base.Interface;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;

    public partial class SIS_MENU : IEntidadeBase
    {
        [Key]
        [Column("CODIGOSISMENU")]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int id { get; set; }
        [Required]
        public string DLL { get; set; }

        public string EMP { get; set; }

        [NotMapped]
        public string CEMP { get; set; }
    }
}
