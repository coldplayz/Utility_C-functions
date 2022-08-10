#include <stdarg.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <stdio.h>
#include "main.h"

/**
 * printp - prints the percentage character (%).
 *
 * Return: the number of bytes written/printed to STDOUT
 */
int printp(void)
{
	int bytes_written;

	bytes_written = 0;

	bytes_written = write(1, "%", 1);

	if (bytes_written == -1)
	{
		return (-1);
	}

	return (bytes_written);
}
