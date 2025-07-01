package net.zorphy.backend.project.qwirkle.service.util;

import java.util.ArrayList;
import java.util.List;

public class Combinatorics {
    public static <T> List<List<T>> getSubsets(List<T> list) {
        List<List<T>> allSubsets = new ArrayList<>();
        calcSubsets(list, 0, new ArrayList<>(), allSubsets);
        return allSubsets;
    }

    private static <T> void calcSubsets(List<T> input, int index, List<T> current, List<List<T>> subsets) {
        if (index == input.size()) {
            subsets.add(new ArrayList<>(current));
            return;
        }

        // Exclude current element
        calcSubsets(input, index + 1, current, subsets);

        // Include current element
        current.add(input.get(index));
        calcSubsets(input, index + 1, current, subsets);
        current.removeLast();
    }


    public static <T> List<List<T>> getPermutations(List<T> input) {
        List<List<T>> result = new ArrayList<>();
        calcPermutations(input, 0, result);
        return result;
    }

    private static <T> void calcPermutations(List<T> list, int index, List<List<T>> result) {
        if (index == list.size()) {
            result.add(new ArrayList<>(list));
            return;
        }

        for (int i = index; i < list.size(); i++) {
            swap(list, index, i);
            calcPermutations(list, index + 1, result);
            swap(list, index, i); // backtrack
        }
    }

    private static <T> void swap(List<T> list, int i, int j) {
        T temp = list.get(i);
        list.set(i, list.get(j));
        list.set(j, temp);
    }
}
