using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSocketSelfHost
{
    public class MyHub : Hub
    {

        public static System.Timers.Timer _Timer;
        public MyHub()
        {
            if (_Timer == null)
            {
                _Timer = new System.Timers.Timer(2000);
                _Timer.Elapsed += new System.Timers.ElapsedEventHandler(OnTimedEvent);
                _Timer.Enabled = true;
                _Timer.Interval = 1000;
            }
        }
        private void OnTimedEvent(object source, System.Timers.ElapsedEventArgs e)
        {
            Clients.All.addMessage(DateTime.Now, "ola");
        }
        //public void Send(string name, string message)
        //{
        //    Clients.All.addMessage(name, message);
        //}
    }
}
