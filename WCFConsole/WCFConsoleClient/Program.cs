using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Text;
using System.Threading.Tasks;
using WCFConsoleClient.PushService;

namespace WCFConsoleClient
{
    class Program : ISampleContractCallback
    {
        static void Main(string[] args)
        {
            MathService.MyMathServiceClient m = new MathService.MyMathServiceClient("NetTcpBinding_IMyMathService");
            Console.WriteLine(m.Add(200, 300));
            

            InstanceContext site = new InstanceContext(null, new Program());
            PushService.SampleContractClient client = new PushService.SampleContractClient(site);

            //create a unique callback address so multiple clients can run on one machine
            NetTcpBinding binding = (NetTcpBinding)client.Endpoint.Binding;
            //string clientcallbackaddress = binding.ClientBaseAddress.AbsoluteUri;
            //clientcallbackaddress += Guid.NewGuid().ToString();
            //binding.ClientBaseAddress = new Uri(clientcallbackaddress);

            //Subscribe.
            Console.WriteLine("Subscribing");
            client.Subscribe();

            Console.ReadKey();
        }

        public void PriceChange(string item, double price, double change)
        {
            Console.WriteLine("alterou: " + item);
        }
    }
}
