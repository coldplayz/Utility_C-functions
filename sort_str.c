#include <stdio.h>
#include <string.h>
#include "main.h"

/**
 * sort_str - sorts an array of strings
 * @ac: integer representing array size
 * @av: a pointer to pointer to char (pointer to the array)
 */
void sort_str(int ac, char *av[])
{
	int i, j;

	for (i = 0; i < (ac - 1); i++)
	{
		for (j = (i + 1); j < ac; j++)
		{
			if (strcmp(av[i], av[j]) > 0)
			{
				swap_arr(av, i, j);
			}
		}
	}
}


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
