namespace Infra.Base
{
    using FirebirdSql.Data.FirebirdClient;
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;

    public class FuncoesBanco
    {
        private FbConnection db;

        public FuncoesBanco(Context db)
        {
            this.db = (FbConnection) db.Database.Connection;
        }

        public DataTable ExecSql(string sql)
        {
            FbDataAdapter dados = new FbDataAdapter(sql, db);
            DataTable dt = new DataTable();
            dados.Fill(dt);
            return dt;
        }

        public int BuscarPKRegistro(string Generator)
        {
            int codigo = 0;

            StringBuilder xSql = new StringBuilder();

            if (Generator.Substring(0, 2) != "G_")
            {
                xSql.AppendFormat("SELECT GEN_ID({0}{1},1) AS INC FROM RDB$DATABASE", "G_", Generator);
            }
            else
            {
                xSql.AppendFormat("SELECT GEN_ID({0},1) AS INC FROM RDB$DATABASE", Generator);
            }
            xSql.AppendLine();

            DataTable dt = ExecSql(xSql.ToString());

            if (dt.Rows.Count > 0)
            {
                DataRow row = dt.Rows[0];
                codigo = Convert.ToInt32(row["INC"].ToString());
            }

            return codigo;
        }

    }
}
