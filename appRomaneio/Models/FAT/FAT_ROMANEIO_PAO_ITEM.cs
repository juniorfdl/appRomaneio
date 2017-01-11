namespace Models.FAT
{
    using Infra.Base.Interface;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;

    public partial class FAT_ROMANEIO_PAO_ITEM : IEntidadeBase
    {
        [Key]
        [Column("COD_FATROMANEIOPAOITEM")]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int id { get; set; }
        [Required]
        public int COD_FATROMANEIOPAO { get; set; }
        [Required]
        public int ITEM { get; set; }
        [Required]
        public int COD_FATOPERACAOSAIDA { get; set; }
        [Required]
        public int COD_CADPRODUTO { get; set; }
        [Required]
        public int? COD_CADUNIDADE { get; set; }
        [Required]
        public int? QUANTIDADE { get; set; }
        [Required]
        public int VALOR_UNITARIO { get; set; }
        public int? QUANTIDADE_TROCA { get; set; }

        [NotMapped]
        public string PRODUTO { get; set; }

        [NotMapped]
        public string CEMP { get; set; }
    }

}
