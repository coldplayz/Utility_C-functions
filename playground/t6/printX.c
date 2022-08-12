#include <stdarg.h>
#include <stdlib.h>
#include <unistd.h>
#include <stdio.h>
#include "main.h"


/**
 * printX - prints an unsigned int in uppercase hex.
 * @n: the unsigned integer to print.
 *
 * Return: the number of characters printed.
 */
int printX(unsigned int n)
{
	unsigned int q = 1, hex_len = 0;
	int i, rem = 0, bytes_written = 0, bytes_count = 0, diff;
	char *ptc, *str = "ABCFEF";

	q = n;
	if (q == 0)
		return (write(1, "0", 1));
	/*find the length of the hex form of the int*/
	for (i = 0; q != 0; i++)
	{
		q = q / 16;
		hex_len++;
	}
	ptc = malloc(sizeof(char) * hex_len + 1);
	if (ptc == NULL)
		return (0);

	q = n;
	/*populate the ptc's malloc'd array*/
	/*with digits of hex, in reversed order*/
	for (i = 0; q != 0; i++)
	{
		rem = q % 16;
		diff = rem - 10;
		if (diff >= 0 && diff <= 5)
			ptc[i] = str[diff];
		else
			ptc[i] = rem + '0';
		q /= 16;
	}

	/*print the ptc array, in reverse*/
	for (i = (hex_len - 1); i >= 0; i--)
	{
		bytes_written = write(1, (ptc + i), 1);
		if (bytes_written == -1)
			return (bytes_count);
		bytes_count += bytes_written;
	}
	return (bytes_count);
}
