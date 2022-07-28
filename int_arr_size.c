#include <stdio.h>
#include <string.h>

int int_arr_size(int *int_array)
{
	int size;

	size = sizeof(int_array) / sizeof(int);

	return (size);
}
