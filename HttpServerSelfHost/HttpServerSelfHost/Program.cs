using Microsoft.Owin.Hosting;
using System;
using System.Net.Http;

namespace HttpServerSelfHost
{
    public class Program
    {
        static void Main()
        {
            string baseAddress = "http://localhost:9000/";


            WebApp.Start<Startup>(baseAddress);

            Console.WriteLine("Service running on "+ baseAddress);

            Console.ReadLine();
        }
    }
}