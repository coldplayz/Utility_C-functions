#include "main.h"

/**
 * reverse_array - reverse order of an integer array
 * @a: integer array pointer
 * @n: sie of array
 */
void reverse_array(int *a, int n)
{
	int counter = 0, temp, low_index = 0, shift = n;

	/*move from last number of array s to first, replacing...*/
	/*...the numbers with first to last numbers respectively*/
	for (shift--; counter < (n / 2); shift--)
	{
		temp = *(a + shift);
		*(a + shift) = a[low_index];
		a[low_index] = temp;
		low_index++;
		counter++;
	}
}
