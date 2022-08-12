#include <stdarg.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <stdio.h>
#include "main.h"

/**
 * printcp - prints a char, or percentage character.
 * @c: the char to print
 *
 * Return: the number of bytes written/printed to STDOUT
 */
int printcp(char c)
{
	int bytes_written;

	bytes_written = 0;

	bytes_written = write(1, c2s(c, 0, 0), 1);

	if (bytes_written == -1)
	{
		return (0);
	}

	return (bytes_written);
}
