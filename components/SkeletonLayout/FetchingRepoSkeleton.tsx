import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SkeletonBlock } from '../block/SkeletonBlock';

const FetchingRepoSkeleton = () => {
  return (
    
    <ScrollView
    showsVerticalScrollIndicator={false}
    bounces={false}
    overScrollMode="never"
    >

    {Array.from({length:10},(_,index)=>(
      <SkeletonBlock key={index} height={115} width={"100%"} radius={18} style={{marginBottom:12, backgroundColor: "rgba(255,255,255,0.02)",}}/>
    ))}
   
    </ScrollView>
    
  );
};

export default FetchingRepoSkeleton;
