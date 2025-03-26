
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

export default function FormButton({ label, onPress, isLoading, disabled }) {
  const isDisabled = isLoading || disabled;

  return (
    <TouchableOpacity
      className={`w-full px-4 py-4 mt-6 rounded-3xl items-center ${
        isDisabled ? 'bg-gray-500' : 'bg-sky-500'
      }`}
      onPress={onPress}
      disabled={isDisabled}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" size={36} />
      ) : (
        <Text className="text-white text-3xl text-center font-bold">{label}</Text>
      )}
    </TouchableOpacity>
  );
}
