#include <stdarg.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <stdio.h>
#include "main.h"

/**
 * printid - prints positive or negative values of  n.
 * @n: the [signed] int to print.
 *
 * Return: the number of bytes printed.
 */
int printid(int n)
{
	int bytes_written = 0;

	if (n < 0)
	{
		bytes_written += print_negint(n);
	}
	else
	{
		bytes_written += print_posint(n);
	}

	return (bytes_written);
}
