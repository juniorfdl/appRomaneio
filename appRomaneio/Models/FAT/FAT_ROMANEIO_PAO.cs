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

    public partial class FAT_ROMANEIO_PAO : IEntidadeBase
    {
        [Key]
        [Column("COD_FATROMANEIOPAO")]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int id { get; set; }
        [Required]
        public string CEMP { get; set; }
        [Required]
        public string CFIL { get; set; }
        [Required]
        public int COD_CADCOLABORADOR { get; set; }
        [Required]
        public int COD_CADTRANSPORTADORA { get; set; }
        [Required]
        public DateTime DATA_EMISSAO { get; set; }
        [Required]
        public int COD_CADCONDPAGAMENTO { get; set; }
        [Required]
        public string TIPO_FRETE { get; set; }        
        public int CODIGO { get; set; }
        [Required]
        public string CODIGO_OC_CLIENTE { get; set; }
        public Nullable<int> COD_CADVENDEDOR { get; set; }
        public Nullable<int> COD_FATPEDIDO { get; set; }
        [Required]
        public DateTime DATA_ENTREGA { get; set; }
        [Required]
        public int COD_CADENTREGADOR { get; set; }
        [NotMapped]
        public String CLIENTE_NOME { get; set; }
        [NotMapped]
        [Required]
        public String CLIENTE_CODIGO { get; set; }

        [NotMapped]
        public String VENDEDOR { get; set; }

        [NotMapped]
        public virtual dynamic Itens { get; set; }
    }

}
