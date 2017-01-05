namespace Models.SIS
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;

    public class SIS_USUARIO_EMPRESA 
    {
        [Key, Column(Order = 0)]
        [Required]
        public int CODIGOSISUSUARIO { get; set; }
        [Key, Column(Order = 1)]
        [Required]
        public int CODIGOEMPRESA { get; set; }
    }
}
