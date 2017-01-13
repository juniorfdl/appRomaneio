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
        [Display(Name = "Item")]
        public int ITEM { get; set; }
        [Required]
        public int COD_FATOPERACAOSAIDA { get; set; }
        [Required]
        [Display(Name = "Produto")]
        public int COD_CADPRODUTO { get; set; }
        [Required]
        [Display(Name = "Unidade")]
        public int? COD_CADUNIDADE { get; set; }
        [Required]
        [Display(Name = "Quantidade")]
        public decimal? QUANTIDADE { get; set; }
        [Required]
        [Display(Name = "Valor Unitário")]
        public decimal VALOR_UNITARIO { get; set; }
        [Display(Name = "Quantidade de Troca")]
        public decimal? QUANTIDADE_TROCA { get; set; }

        [NotMapped]
        public string PRODUTO { get; set; }

        [NotMapped]
        public string CEMP { get; set; }
    }

}
