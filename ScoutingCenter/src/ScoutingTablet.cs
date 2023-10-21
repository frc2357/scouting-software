﻿using InTheHand.Net.Sockets;
using System;
using System.Diagnostics;
using System.IO;
using System.Threading;
using System.Windows;
using System.Windows.Controls;

namespace ScoutingCenter.src
{

    public class ScoutingTablet
    {
        private BluetoothClient client;

        private Thread readMatches;
        public string id { get; }

        public WindowFields fields { get; set; }
        public MatchAssignment currentMatchAssignment { get; set; }

        public ScoutingTablet(BluetoothClient client)
        {
            this.client = client;
            id = parseName(client.RemoteMachineName);

            readMatches = new Thread(new ThreadStart(runReadMatches));
            readMatches.IsBackground = true;
            readMatches.Start();
        }

        ~ScoutingTablet()
        {
            readMatches.Abort();
        }

        public void runReadMatches()
        {
            string documents = Environment.GetFolderPath(Environment.SpecialFolder.Personal);
            string matchPath = Directory.CreateDirectory(documents + "\\matchLog").FullName;

            while (true)
            {
                if (!client.Connected)
                {
                    Application.Current.Dispatcher.Invoke(() =>
                    { setConnected(false); setLastInfo("Lost Connection"); });

                    return;
                }

                try
                {
                    string matchStr = "";
                    while (client.GetStream().DataAvailable)
                    {
                        byte[] buffer = new byte[1024];
                        client.GetStream().Read(buffer, 0, 1024);

                        matchStr += System.Text.Encoding.ASCII.GetString(buffer);
                    }

                    if (matchStr.Length == 0)
                    {
                        continue;
                    }

                    string[] matches = matchStr.Split('\n');

                    foreach (string match in matches)
                    {
                        if (string.IsNullOrWhiteSpace(match))
                        {
                            continue;
                        }

                        string matchKey = "\"matchNum\":";
                        int matchIdx = match.IndexOf(matchKey);
                        matchIdx += matchKey.Length;
                        int matchLen = match.IndexOf(",", matchIdx) - matchIdx;

                        string matchNum = match.Substring(matchIdx, matchLen);

                        string filename = id.ToLower() + "-match-" + matchNum + ".json";

                        using (StreamWriter outputFile =
                            new StreamWriter(System.IO.Path.Combine(matchPath, filename)))
                        {
                            outputFile.WriteLine(match);
                        }
                        Application.Current.Dispatcher.Invoke(() => setLastInfo("Recv Match: " + matchNum));
                    }
                    Debug.WriteLine("Matches wrote");

                }
                catch (Exception err)
                {
                    Debug.Write("Error: ");
                    Debug.WriteLine(err.ToString());
                }
            }
        }

        /** <summary>
        * <para>
        * Writes a provided message that does NOT have a delimiter present already
        * </para> <para>
        * User needs to provide a bluetooth client with an active connection, as well as the message
        * </para> <para>
        * In case of an exception, the method returns null</para></summary>
        * */
        public void writeToStream(String message)
        {
            try
            {
                Byte[] encodedMessage = System.Text.Encoding.ASCII.GetBytes((message + '\n'));
                client.GetStream().Write(encodedMessage, 0, encodedMessage.Length);
            }
            catch (Exception err)
            {
                Debug.WriteLine(err.ToString());
            }
        }

        public void sendAssignment()
        {
            string assignment = "{\"type\": \"assignment\", \"info\": {\"scouter\": \""
                + fields.scouter.Text + "\", \"id\": \"" + id + "\"}}";
            writeToStream(assignment);
        }

        public void sendMatch()
        {
            string[] strs = id.Split('-');
            string match = "{\"type\": \"match\", \"info\": {" +
                "\"teamNum\":\"" + currentMatchAssignment.teamNum + "\"," +
                "\"matchNum\":" + currentMatchAssignment.matchNum + "," +
                "\"alliance\":\"" + strs[0] + "\"," +
                "\"alliancePos\":\"" + strs[1] + "\"}}";
            writeToStream(match);
        }

        public void setConnected(bool isConnected)
        {
            fields.isConnected.IsChecked = isConnected;
        }

        public void setLastInfo(string message)
        {
            fields.lastInfo.Text = message;
        }

        public static string parseName(string name)
        {
            return name.Substring(name.IndexOf('-') + 1);
        }

        public static Predicate<ScoutingTablet> byId(string id)
        {
            return delegate (ScoutingTablet tablet)
            {
                return tablet.id == id;
            };
        }

        public class WindowFields
        {
            public CheckBox isConnected { get; set; }
            public TextBox lastInfo { get; set; }
            public TextBox scouter { get; set; }
        }

        public class MatchAssignment
        {
            public string teamNum { get; set; }
            public int matchNum { get; set; }
        }
    }
}