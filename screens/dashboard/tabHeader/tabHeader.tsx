import React from "react";
import { View } from "react-native";
import NavItem from "../navItem";
import { styles } from "./styles";

export type TabType = {
  title: string;
  icon: React.ReactNode;
  children?: (onClose?: () => void) => React.JSX.Element;
};

type PropsType = {
  tabs: TabType[];
  currentTab: TabType;
  onChange: (e: string) => void;
};

export const TabHeader = ({ tabs, currentTab, onChange }: PropsType) => {
  return (
    <View style={styles.wrapper}>
      {tabs.map((tab, count) => (
        <View key={tab.title} style={styles.innerContainer}>
          <NavItem
            active={currentTab.title === tab.title}
            handleClick={(e) => onChange(e)}
            text={tab.title}
            icon={tab.icon}
          />
          {count + 1 !== tabs.length && <View style={styles.seperator} />}
        </View>
      ))}
    </View>
  );
};
