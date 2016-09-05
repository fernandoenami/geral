using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Web;

namespace MyMathServiceLib
{
    [ServiceContract]
    public interface IMyMathService
    {
        [OperationContract]
        [WebGet]
        double Add(double dblNum1, double dblNum2);

        [OperationContract]
        [WebGet]
        double Subtract(double dblNum1, double dblNum2);

        [OperationContract]
        [WebGet]
        double Multiply(double dblNum1, double dblNum2);

        [OperationContract]
        [WebGet]
        double Divide(double dblNum1, double dblNum2);

        [OperationContract]
        [WebGet(UriTemplate = "operation/{op}/{n1}/{n2}", ResponseFormat = WebMessageFormat.Json)]
        double Operation(string op, string n1, string n2);

        [OperationContract]
        [WebGet]
        string GetValue();
    }

    public class MyMathService : IMyMathService
    {
        public double Add(double dblNum1, double dblNum2)
        {
            return (dblNum1 + dblNum2);
        }
        public double Subtract(double dblNum1, double dblNum2)
        {
            return (dblNum1 - dblNum2);
        }
        public double Multiply(double dblNum1, double dblNum2)
        {
            return (dblNum1 * dblNum2);
        }
        public double Divide(double dblNum1, double dblNum2)
        {
            return ((dblNum2 == 0) ? 0 : (dblNum1 / dblNum2));
        }

        public double Operation(string op, string n1, string n2)
        {
            switch (op)
            {
                case "add":
                    return Add(double.Parse(n1), double.Parse(n2));
                default:
                    return 0;
                    break;
            }
        }
        public string GetValue()
        {
            return "RETORNANDO...";
        }
    }
}