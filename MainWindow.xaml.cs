using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace WpfBrowser
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            //this.browser.Navigate("http://localhost:8080");
            //this.browser.Navigate("file:///C:/dev/TradingView/JSApi/WpfBrowser/index.html");
            txtData.Text = "{ time: 1e3 * 1475452800, open: 20, high: 22, low: 23, close: 28, volume: 21056200 }";
        }

        private void Browser_LoadCompleted(object sender, NavigationEventArgs e)
        {
            if (this.Browser.IsLoaded)
            {
                try
                {
                    //System.Web.Script.Serialization.JavaScriptSerializer oSerializer =
                    //         new System.Web.Script.Serialization.JavaScriptSerializer();
                    //string barJson = oSerializer.Serialize("{ time: 1e3 * 1475452800, open: 20, high: 22, low: 23, close: 28, volume: 21056200 }");
                    //object o = new object[1];
                    //o[0] = "{ time: 1e3 * 1475452800, open: 20, high: 22, low: 23, close: 28, volume: 21056200 }";
                    //Browser.InvokeScript("addBar", "{ time: 1e3 * 1475452800, open: 20, high: 22, low: 23, close: 28, volume: 21056200 }");

                }
                catch (Exception ex)
                {
                    string msg = "Could not call script: " + ex.Message;
                    MessageBox.Show(msg);
                }

            }
        }

        private void txtData_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Enter)
            {
                Browser.InvokeScript("addBar", txtData.Text);
            }

        }

        //public void HideScriptErrors(WebBrowser wb, bool Hide)
        //{

        //    FieldInfo fiComWebBrowser = typeof(WebBrowser).GetField("_axIWebBrowser2", BindingFlags.Instance | BindingFlags.NonPublic);
        //    if (fiComWebBrowser == null) return;
        //    object objComWebBrowser = fiComWebBrowser.GetValue(wb);

        //    if (objComWebBrowser == null) return;

        //    objComWebBrowser.GetType().InvokeMember(
        //    "Silent", BindingFlags.SetProperty, null, objComWebBrowser, new object[] { Hide });

        //}

        //private void browser_Navigated(object sender, NavigationEventArgs e)
        //{
        //    HideScriptErrors(this.browser, true);
        //}
    }
}
