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

    public partial class SIS_USUARIO : IEntidadeBase
    {
        [Key]
        [Column("CODIGOSISUSUARIO")]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int id { get; set; }
        [Required]
        public string NOME { get; set; }
        [Required]
        public string PWD { get; set; }
        public string ADMIN { get; set; }
        public int? COD_CADVENDEDOR { get; set; }
        [NotMapped]
        public string VENDEDOR { get; set; }
    }
}
