import { FlatList, Text, View } from 'react-native';

const data = ['Supplier 1', 'Supplier 2', 'Supplier 3', 'Supplier 4', 'Supplier 5', 'Supplier 6','Supplier 7','Supplier 8','Supplier 9'];

export default function SuppliersDisplay({ user }) {
    return (
      <View className=" bg-blue-100 rounded-xl mb-6">
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View className="p-4 rounded-xl border-b border-gray-100 border">
              <Text className=" text-xl text-gray-800">{item}</Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }