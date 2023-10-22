﻿using ScoutingCenter.src;
using System.Collections.Generic;
using System.Windows;

namespace ScoutingCenter
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private readonly List<ScoutingTablet> tablets = new List<ScoutingTablet>();
        private BluetoothThreadHandler threadHandler;
        private MatchController matchController;
        public MainWindow()
        {
            InitializeComponent();
            setUpScoutingCenter();
        }

        /**
         * <summary>
         * The method that sets everything up
         * </summary>
         */
        public void setUpScoutingCenter()
        {
            matchController = new MatchController()
            {
                fields = new MatchController.WindowFields()
                {
                    reSendMatch = ReSendMatch,
                    sendNextMatch = SendNextMatch,
                    currentMatch = CurrentMatchLabel,
                    eventName = EventName
                }
            };
            threadHandler = new BluetoothThreadHandler(tablets, getTabletFields, matchController.getMatchAssignment);
            threadHandler.startThread();
        }

        public ScoutingTablet.WindowFields getTabletFields(string id)
        {
            switch (id)
            {
                case "RED-1":
                    return new ScoutingTablet.WindowFields
                    {
                        isConnected = Red1Connected,
                        lastInfo = Red1LastInfo,
                        scouter = Red1Scouter,
                        eventName = EventName
                    };
                case "RED-2":
                    return new ScoutingTablet.WindowFields
                    {
                        isConnected = Red2Connected,
                        lastInfo = Red2LastInfo,
                        scouter = Red2Scouter,
                        eventName = EventName
                    };
                case "RED-3":
                    return new ScoutingTablet.WindowFields
                    {
                        isConnected = Red3Connected,
                        lastInfo = Red3LastInfo,
                        scouter = Red3Scouter,
                        eventName = EventName
                    };
                case "BLUE-1":
                    return new ScoutingTablet.WindowFields
                    {
                        isConnected = Blue1Connected,
                        lastInfo = Blue1LastInfo,
                        scouter = Blue1Scouter,
                        eventName = EventName
                    };
                case "BLUE-2":
                    return new ScoutingTablet.WindowFields
                    {
                        isConnected = Blue2Connected,
                        lastInfo = Blue2LastInfo,
                        scouter = Blue2Scouter,
                        eventName = EventName
                    };
                case "BLUE-3":
                    return new ScoutingTablet.WindowFields
                    {
                        isConnected = Blue3Connected,
                        lastInfo = Blue3LastInfo,
                        scouter = Blue3Scouter,
                        eventName = EventName
                    };
            }
            return null;
        }


        private void onImportMatchData(object sender, RoutedEventArgs e)
        {
            matchController.importMatchCSV();
        }


        private void onExportMatch(object sender, RoutedEventArgs e)
        {
            matchController.exportMatchCSV();
        }

        private void onSendAssignment(object sender, RoutedEventArgs e)
        {
            foreach (ScoutingTablet tablet in tablets)
            {
                tablet.sendAssignment();
            }
        }

        private void sendMatch()
        {
            foreach (ScoutingTablet tablet in tablets)
            {
                tablet.currentMatchAssignment = matchController.getMatchAssignment(tablet.id);
                tablet.sendMatch();
            }
        }

        private void onSendNextMatch(object sender, RoutedEventArgs e)
        {
            matchController.gotoNextMatch();
            if (matchController.outOfMatches())
            {
                return;
            }

            sendMatch();
        }

        private void onReSendNextMatch(object sender, RoutedEventArgs e)
        {
            if (matchController.runningMatch())
            {
                sendMatch();
            }
        }
    }
}