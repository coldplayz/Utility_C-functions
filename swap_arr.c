#include <stdio.h>
#include <string.h>

int _strlen(char *s);
char *_strcpy(char *dest, char *src);

/**
 * swap_arr - swap the positions of elements at the indicated indices
 * @i: integer representing one of the indices to swap
 * @j: integer representing one of the indices to swap
 */
void swap_arr(char *arr[], int i, int j)
{
	char *const tmp = arr[i];

	arr[i] = arr[j];
	arr[j] = tmp;
}
